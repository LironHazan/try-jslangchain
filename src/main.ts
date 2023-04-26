#! /usr/bin/env node
import { Command } from "commander";
import * as UnitTester from "./prompts/unit-tester";
import * as Ingestor from "./ingestor/ingestor";
import * as Query from "./query/query";
const program = new Command();

program
    .name('try-langchain')
    .description('CLI to experiment LLM abstractions')
    .version('0.0.1');

const func = `
    fun foo(bar unit8) {
        bar + 42
     }
`;

program.command('test')
    .description('generate tests')
    .action(async () => {
        console.log(await UnitTester.run({ func, lang: 'rust'}));
    });

program.command('ingest')
    .description('ingest')
    .action(async () => {
        await Ingestor.run();
        console.log("done")
    });

program.command('search')
    .description('search')
    .action(async () => {
        await Query.run();
        console.log("done")
    });

program.parse();



