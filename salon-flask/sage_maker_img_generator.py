import base64
import boto3
import matplotlib.pyplot as plt
import numpy as np
import json
from PIL import Image
from io import BytesIO

endpoint_name = 'jumpstart-dft-stable-diffusion-v2-1-base'

prompt = "Don't include any text and create an invite for this event:\n\nRelax and classy salon in Palo Alto for AI Art at Ultra Modern house because This architecturally-designed modern house in Palo Alto is tastefully furnished and bathed in ample light, evoking a luxurious and relaxing vibe, perfect for an AI art event. The backyard, equally stunning and well-lit, provides a classy atmosphere for the occasion. The venue fits within the given budget of $500 and is available next week."
payload = { "prompt": prompt, "width":600, "height":600, "num_images_per_prompt":1, "num_inference_steps":50, "guidance_scale":7.5}

def parse_response(query_response):
    response_dict = json.loads(query_response['Body'].read())
    return response_dict['generated_image'], response_dict['prompt']

def display_image(img, prmpt):
    plt.figure(figsize=(12,12))
    plt.imshow(np.array(img))
    plt.axis('off')
    plt.title(prmpt)
    plt.show()

def query_endpoint_with_json_payload(encoded_json):
    client = boto3.client('runtime.sagemaker',
                    aws_access_key_id='KIAU5G3EWY23TMQA6W3',
                    aws_secret_access_key='KMptYj3GI1kS+ItbY2mBSfZ1YUkEphNUSaunKQK'
    )
    response = client.invoke_endpoint(EndpointName=endpoint_name, ContentType='application/json', Body=encoded_json)
    return response

def parse_response_multiple_images(query_response):
    response_dict = json.loads(query_response['Body'].read())
    return response_dict['generated_images'], response_dict['prompt']

query_response = query_endpoint_with_json_payload(json.dumps(payload).encode('utf-8'))
generated_images, prompt = parse_response_multiple_images(query_response)
for img in generated_images:
    display_image(img, "")
    #display_image(img, prompt)
