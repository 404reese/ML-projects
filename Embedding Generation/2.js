def get_embeddings(text, model, api_key):
    url = 'https://api.openai.com/v1/embeddings'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  api_key
    }
    data = {
        'input': text,
        'model': model,
        'options': { 'wait_for_model': True }
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    responseData = response.json()

    return responseData['data'][0]['embedding']