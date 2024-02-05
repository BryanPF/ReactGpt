import OpenAI from "openai";


interface Options {
    prompt: string;
    lang: string;
}


export const translateUseCase = async( openia: OpenAI, { prompt, lang }: Options ) => {

    const completion = await openia.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `
                Traduce el siguiente texto al idioma ${lang}:${ prompt }
                `
            },
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.3,

    });


    return { message: completion.choices[0].message.content }
}