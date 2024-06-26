import os
from flask import Flask, jsonify, request, send_file
import boto3
import matplotlib.pyplot as plt
import numpy as np
import json
from PIL import Image
from io import BytesIO
import io


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'message': 'This is sample data.',
        'value': 42
    }
    return jsonify(data)

@app.route('/api/echo', methods=['POST'])
def echo_data():
    data = request.get_json()
    return jsonify(data)


def parse_response(query_response):
    response_dict = json.loads(query_response['Body'].read())
    return response_dict['generated_image'], response_dict['prompt']

def display_image(img, prmpt):
    plt.figure(figsize=(12,12))
    plt.imshow(np.array(img))
    plt.axis('off')
    plt.title(prmpt)
    plt.show()

endpoint_name = 'jumpstart-dft-stable-diffusion-v2-1-base'


def query_endpoint_with_json_payload(encoded_json):
    client = boto3.client('runtime.sagemaker',
                    aws_access_key_id='KIAU5G3EWY23TMQA6W3',
                    aws_secret_access_key='6KMptYj3GI1kS+ItbY2mBSfZ1YUkEphNUSaunKQK'
    )
    response = client.invoke_endpoint(EndpointName=endpoint_name, ContentType='application/json', Body=encoded_json)
    return response

def parse_response_multiple_images(query_response):
    response_dict = json.loads(query_response['Body'].read())
    return response_dict['generated_images'], response_dict['prompt']

@app.route('/ai_image/<img_prompt>')
def generate_image(img_prompt):
    
    #prompt = "Don't include any text and create an invite for this event:\n\nRelax and classy salon in Palo Alto for AI Art at Ultra Modern house because This architecturally-designed modern house in Palo Alto is tastefully furnished and bathed in ample light, evoking a luxurious and relaxing vibe, perfect for an AI art event. The backyard, equally stunning and well-lit, provides a classy atmosphere for the occasion. The venue fits within the given budget of $500 and is available next week."
    payload = { "prompt": img_prompt, "width":600, "height":600, "num_images_per_prompt":1, "num_inference_steps":50, "guidance_scale":7.5}

    query_response = query_endpoint_with_json_payload(json.dumps(payload).encode('utf-8'))
    generated_images, prompt = parse_response_multiple_images(query_response)
    for img in generated_images:
        # Create a BytesIO object to store the image data
        img_buffer = io.BytesIO()
        # Save the image to the BytesIO buffer
        img_array = np.array(img)
        plt.imshow(img_array)
        plt.axis('off')
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)  # Move the buffer's position to the start
        plt.clf()           # Reset the figure to prevent overlapping images
        #display_image(img, "")

    return img_buffer.getvalue(), 200, {'Content-Type': 'image/png', 'Content-Disposition': 'attachment; filename=ai_image.png'}


@app.route('/ai_audio/<text_prompt>')
def generate_audio(text_prompt):
    polly_client = boto3.client('polly',
        aws_access_key_id='KIAU5G3EWY23TMQA6W3',
        aws_secret_access_key='6KMptYj3GI1kS+ItbY2mBSfZ1YUkEphNUSaunKQK'                            
    )

    # Synthesize speech using Polly
    response = polly_client.synthesize_speech(
        Text=text_prompt,
        OutputFormat='mp3',
        VoiceId='Joanna'
    )

    # Save the speech audio to a file
    audio_file = 'speech.mp3'
    with open(audio_file, 'wb') as f:
        f.write(response['AudioStream'].read())

    # Return the audio file as a response
    return send_file(audio_file, mimetype='audio/mpeg')
    #return "Audio", 200, {'Content-Type': 'audio/wav', 'Content-Disposition': 'attachment; filename=ai_audio.wav'}

if __name__ == '__main__':
     app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

     