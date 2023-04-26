import {StructuredOutputParser} from "langchain/output_parsers";
import {PromptTemplate} from "langchain/prompts";
import {OpenAI} from "langchain/llms/openai";

export const run = async (options: { func: string, lang: string }): Promise<string> => {

    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        answer: "answer to the user's question",
        code: "code of the unit test"
    });

    const format_instructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
        template:
            `You will be asked to write a unit test for a given function in ${options.lang}.\n{format_instructions}\n{func}`,
        inputVariables: ["func"],
        partialVariables: { format_instructions },
    });

    const model = new OpenAI({
        streaming: false,
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.4 }
    );

    const input = await prompt.format({
        func: `write a test to the following function: ${options.func}`,
    });

    const response = await model.call(input);
    const parsed = await parser.parse(response);
    return parsed.code;
};
