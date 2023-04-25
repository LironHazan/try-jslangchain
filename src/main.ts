#! /usr/bin/env node
import { Command } from "commander";
import {ingest} from "./ingestor/ingestor";

const program = new Command();

// program
//     .name('try-langchain')
//     .description('CLI to experiment LLM abstractions')
//     .version('0.0.1');
//
// program.command('ingest')
//     .description('Ingests the content of pdfs')
//     .action(async () => {
//         await ingest();
//         console.log('ingestion completed');
//     });
//
// program.parse();

(async () => {
    await ingest();
    console.log('ingestion completed');
})()