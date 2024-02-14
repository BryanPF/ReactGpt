import OpenAI from "openai";
import { downloadImageAsPng } from "src/helpers";



interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}



export const imageGenerationUseCase = async( openia: OpenAI, { prompt, originalImage, maskImage }: Options ) => {

    const response = await openia.images.generate({
        prompt: prompt,
        model: 'dall-e-2',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
    });

     await downloadImageAsPng( response.data[0].url );

    return {
        url: response.data[0].url,
        localPath: '',
        revised_prompt: response.data[0].revised_prompt,
    }

}