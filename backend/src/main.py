from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
import os
from dotenv import load_dotenv  
from pptx import Presentation
from pptx.util import Inches
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware 
from pptx.dml.color import RGBColor

# Load environment variables
load_dotenv()

# Get the API key from environment
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment or .env file!")

# Initialize OpenAI Client
client = OpenAI(api_key=api_key)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class PPTRequest(BaseModel):
    topic: str
    num_slides: Optional[int] = 5
    layout_preference: Optional[str] = "Varied"

# Generate slide content using AI
def generate_slide_content(topic: str, num_slides: int):
    prompt = f"""
    Generate content for a {num_slides}-slide PowerPoint presentation about "{topic}".
    Each slide should have:
    - A clear slide title
    - 3-5 key bullet points explaining the topic
    - If relevant, suggest an image placeholder with a description (e.g., "Insert Image: Growth of AI in Healthcare").
    Format the response as:
    
    Slide 1:
    Title: [Slide Title]
    - [Bullet Point 1]
    - [Bullet Point 2]
    - [Bullet Point 3]
    Image: [Optional Image Placeholder]
    
    Slide 2:
    Title: [Slide Title]
    - [Bullet Point 1]
    - [Bullet Point 2]
    - [Bullet Point 3]
    Image: [Optional Image Placeholder]
    """

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a PowerPoint expert."},
            {"role": "user", "content": prompt}
        ]
    )
    
    response_message = response.choices[0].message.content.strip()
    
    slides = response_message.split("\n\n")
    structured_slides = []

    for slide in slides:
        lines = slide.split("\n")
        title = lines[0].replace("Title: ", "").strip()
        bullets = [line.strip() for line in lines[1:] if line.startswith("- ")]
        image = next((line.replace("Image: ", "").strip() for line in lines if line.startswith("Image: ")), None)

        structured_slides.append({"title": title, "bullets": bullets, "image": image})
    
    return structured_slides


# Create PowerPoint file with layout preference
def create_pptx(topic: str, slides_data, layout_preference: str, filename="presentation.pptx"):
    prs = Presentation()

    # Apply a professional theme
    prs.slide_master.name = "Ion Boardroom"  # This applies a PowerPoint theme

    # Title Slide
    title_slide_layout = prs.slide_layouts[0]  # Title Slide
    slide = prs.slides.add_slide(title_slide_layout)
    slide.shapes.title.text = topic

    if len(slide.placeholders) > 1:  # Check if subtitle placeholder exists
        slide.placeholders[1].text = "AI-Generated Presentation"

    # Define layout mapping
    layout_mapping = {
        "Varied": [1, 5, 3, 2, 8],  # Mix of text, image, and two-column layouts
        "Text-Heavy": [1, 1, 1, 1, 1],  # All text-based slides
        "Image-Focused": [8, 8, 8, 8, 8],  # All image-based slides
    }

    for i, slide_content in enumerate(slides_data):
        title_text = slide_content["title"]
        bullet_points = slide_content["bullets"]
        image_placeholder = slide_content["image"]

        # Choose layout dynamically
        chosen_layout = layout_mapping.get(layout_preference, layout_mapping["Varied"])
        slide_layout_index = chosen_layout[i % len(chosen_layout)]
        slide_layout = prs.slide_layouts[slide_layout_index]

        slide = prs.slides.add_slide(slide_layout)

        # Set title
        if slide.shapes.title:
            slide.shapes.title.text = title_text
            slide.shapes.title.text_frame.paragraphs[0].font.bold = True
            slide.shapes.title.text_frame.paragraphs[0].font.size = Inches(0.7)
        
        # Content Layouts
        if slide_layout_index in [1, 2, 5]:  # Text-based layouts
            if len(slide.placeholders) > 1:
                content_placeholder = slide.placeholders[1]
                content_placeholder.text = ""  # Clear default text
                for bullet in bullet_points:
                    p = content_placeholder.text_frame.add_paragraph()
                    p.text = bullet
                    p.space_after = Inches(0.2)

        # Two-Column Layout
        elif slide_layout_index == 3:  
            if len(slide.placeholders) > 1:
                left_text = slide.placeholders[0]
                right_text = slide.placeholders[1]
                
                left_text.text = title_text
                for bullet in bullet_points:
                    p = right_text.text_frame.add_paragraph()
                    p.text = bullet
                    p.space_after = Inches(0.2)

        # Image Placeholder Layouts
        elif slide_layout_index == 8:  
            left = Inches(1)
            top = Inches(2)
            width = Inches(5)
            height = Inches(3)
            
            slide.shapes.add_textbox(left, top, width, height).text = f"Insert Image: {image_placeholder}"
            slide.shapes[-1].text_frame.paragraphs[0].font.color.rgb = RGBColor(255, 0, 0)  # Red placeholder text

    # Save file
    prs.save(filename)
    return filename


@app.post("/generate_ppt")
async def generate_ppt(request: PPTRequest, background_tasks: BackgroundTasks):
    slides_data = generate_slide_content(request.topic, request.num_slides)
    filename = f"{request.topic.replace(' ', '_')}.pptx"
    background_tasks.add_task(create_pptx, request.topic, slides_data, request.layout_preference, filename)
    return {"message": "Presentation is being generated.", "filename": filename}

@app.get("/download_ppt/{filename}")
async def download_ppt(filename: str):
    file_path = f"./{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", filename=filename)
    return {"error": "File not found"}
