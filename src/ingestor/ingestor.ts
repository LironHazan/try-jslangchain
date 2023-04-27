import { Client } from "@opensearch-project/opensearch";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenSearchVectorStore } from "langchain/vectorstores/opensearch";
import { JSONLoader } from "langchain/document_loaders/fs/json";



export async function run() {
    const client = new Client({
        nodes: [process.env.OPENSEARCH_URL ?? 'http://127.0.0.1:9200'],
    });

    const loader = new JSONLoader(
        "src/ingestor/example.json",
        ["/taskId", "/target"]
    );

    const docs = await loader.load();
    console.log(docs)

    // todo: plugin https://opensearch.org/docs/latest/search-plugins/neural-search/
    // How to load local model (all-miniLM-L6-v2 pt) for creating embeddings instead of using OpenAIEmbeddings ?
    // Or if there's a way using hugingface API? // const hf = new HfInference(process.env.HUGFACE_READ_API ?? '')

    await OpenSearchVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        client,
        indexName: process.env.OPENSEARCH_INDEX ?? 'documents',
    });
}