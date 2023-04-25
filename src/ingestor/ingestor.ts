import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {initPinecone, PINECONE_INDEX_NAME, PINECONE_NAME_SPACE} from "./pinecone_client";
import {CustomPDFLoader} from "./pdf_loader";

/* Name of directory to retrieve your files from */
const filePath = 'docs';

export const ingest = async () => {
    try {
        /*load raw docs from the all files in the directory */
        const directoryLoader = new DirectoryLoader(filePath, {
            '.pdf': (path) => new CustomPDFLoader(path),
        });

        const loader = new PDFLoader("path/to/large.pdf", {
            splitPages: false,
        });

        const rawDocs = await directoryLoader.load();

        /* Split text into chunks */
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await textSplitter.splitDocuments(rawDocs);
        console.log('split docs');

        console.log('creating vector store...');

        /*create and store the embeddings in the vectorStore*/
        const embeddings = new OpenAIEmbeddings();
        const pinecone = await initPinecone();
        const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

        //embed the PDF documents
        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: index,
            namespace: PINECONE_NAME_SPACE,
            textKey: 'text',
        });
    } catch (error) {
        console.log('error', error);
        throw new Error('Failed to ingest your data');
    }
};


