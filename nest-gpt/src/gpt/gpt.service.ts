import * as path from "path";
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, orthographyCheckUserCase, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, textToAudioUseCase, translateStreamUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './DTOs';
import OpenAI from 'openai';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    async orthographyCheck( orthographyDto: OrthographyDto ) {
        return await orthographyCheckUserCase(this.openai, {
            prompt: orthographyDto.prompt
        });
    }


    async prosConsDiscusser( prosConsDiscusserDto: ProsConsDiscusserDto ){
        return await prosConsDiscusserUseCase(this.openai, {
            prompt: prosConsDiscusserDto.prompt
        });
    }


    async prosConsDiscusserStream( prosConsDiscusserDto: ProsConsDiscusserDto ){
        return await prosConsDiscusserStreamUseCase(this.openai, {
            prompt: prosConsDiscusserDto.prompt
        });
    }


    async translate( translateDto: TranslateDto ){
        return await translateUseCase(this.openai, {
            lang: translateDto.lang,
            prompt: translateDto.prompt,
        });
    }

    async translateStream( translateDto: TranslateDto ){
        return await translateStreamUseCase(this.openai, {
            lang: translateDto.lang,
            prompt: translateDto.prompt,
        })
    }


    async texToAudio( textToAudioDto: TextToAudioDto ){
        return await textToAudioUseCase(this.openai, {
            prompt: textToAudioDto.prompt,
            voice: textToAudioDto.voice,
        })
    }

    async texToAudioGetter( fileId: string ){

        const filePath = path.resolve( __dirname, '../../generated/audios/', `${ fileId }.mp3` );
        const wasFound = fs.existsSync( filePath );

        if( !wasFound ) throw new NotFoundException(`File ${ fileId } not found`);

        return filePath;

    }


    async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto ){
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase(this.openai, { audioFile, prompt });
    }


    async imageGeneration( imageGenerationDto: ImageGenerationDto ){
        return imageGenerationUseCase(this.openai, {...imageGenerationDto});
    }



    async imageGenerationGetter( fileName: string ){

        const filePath = path.resolve('./','./generated/images/', fileName);
        const wasFound = fs.existsSync( filePath );

        if( !wasFound ) throw new NotFoundException(`File ${ fileName } not found`);

        return filePath;

    }

}
