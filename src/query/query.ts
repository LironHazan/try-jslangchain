import { Client } from "@opensearch-project/opensearch";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenSearchVectorStore } from "langchain/vectorstores/opensearch";
import {VectorDBQAChain} from "langchain/chains";
import {OpenAI} from "langchain/llms/openai";


export async function run() {
    const client = new Client({
        nodes: [process.env.OPENSEARCH_URL ?? "http://127.0.0.1:9200"],
    });

    const vectorStore = new OpenSearchVectorStore(new OpenAIEmbeddings(), {
        client,
    });

    const results = await vectorStore.similaritySearch("build", 1);
    console.log(JSON.stringify(results, null, 2));

    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
        k: 1,
        returnSourceDocuments: true,
    });
    const response = await chain.call({ query: "What is a task?" });

    console.log(JSON.stringify(response, null, 2));

}