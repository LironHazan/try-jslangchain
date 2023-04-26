import { Client } from "@opensearch-project/opensearch";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenSearchVectorStore } from "langchain/vectorstores/opensearch";
import { Document } from "langchain/document";


export async function run() {
    const client = new Client({
        nodes: [process.env.OPENSEARCH_URL ?? 'http://127.0.0.1:9200'],
    });

    const docs = [
        new Document({
            metadata: { foo: "bar" },
            pageContent: "opensearch is also a vector db",
        }),
        new Document({
            metadata: { foo: "bar" },
            pageContent: "the quick brown fox jumped over the lazy dog",
        }),
        new Document({
            metadata: { baz: "qux" },
            pageContent: "lorem ipsum dolor sit amet",
        }),
        new Document({
            metadata: { baz: "qux" },
            pageContent:
                "OpenSearch is a scalable, flexible, and extensible open-source software suite for search, analytics, and observability applications",
        }),
    ];

    await OpenSearchVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
        client,
        indexName: process.env.OPENSEARCH_INDEX ?? 'documents',
    });
}