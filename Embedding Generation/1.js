exports = async function(changeEvent) {
    
    const doc = changeEvent.fullDocument;

    const url = 'https://api.openai.com/v1/embeddings';
    
    const openai_key = context.values.get("openAI_secret");
    try {
        console.log(`Processing document with id: ${doc._id}`);

        
        let response = await context.http.post({
            url: url,
             headers: {
                'Authorization': [`Bearer ${openai_key}`],
                'Content-Type': ['application/json']
            },
            body: JSON.stringify({
                
                input: doc.plot,
                model: context.values.get("model")
            })
        });

        
        let responseData = EJSON.parse(response.body.text());

        if(response.statusCode === 200) {
            console.log("Successfully received embedding.");

            const embedding = responseData.data[0].embedding;

            const collection = context.services.get("cluster0").db("sample_mflix").collection("movies");

            const result = await collection.updateOne(
                { _id: doc._id },
                { $set: { plot_embedding: embedding }}
            );

            if(result.modifiedCount === 1) {
                console.log("Successfully updated the document.");
            } else {
                console.log("Failed to update the document.");
            }
        } else {
            console.log(`Failed to receive embedding. Status code: ${response.statusCode}`);
        }

    } catch(err) {
        console.error(err);
    }
};

