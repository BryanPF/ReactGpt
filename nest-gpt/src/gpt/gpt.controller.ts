import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './DTOs';
import type { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ){
  
    return this.gptService.orthographyCheck( orthographyDto );
  }


  @Post('pros-cons-discusser')
  prosConsDiscusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ){
    return this.gptService.prosConsDiscusser( prosConsDiscusserDto );
  }


  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.prosConsDiscusserStream( prosConsDiscusserDto );

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await( const chunk of stream ){
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write( piece );
    }

    res.end();

  }


  @Post('translate')
  async translate(
    @Body() translateDto: TranslateDto,
  ){
    return this.gptService.translate( translateDto );
  }


  @Post('translate-Stream')
  async translateStream(
    @Body() translateDto: TranslateDto,
    @Res() res: Response,
  ){
    
    const stream = await this.gptService.translateStream( translateDto );
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await( const chunk of stream ){
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write( piece );
    }

    res.end();

  }


  @Post('text-to-audio')
  async texToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ){
    const filePath = await this.gptService.texToAudio( textToAudioDto );

    res.setHeader('Content-Type', 'audio/mp3');
    res.status( HttpStatus.OK );
    res.sendFile( filePath );

  }



  @Get('text-to-audio/:fileId')
  async texToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string, 
  ){
    const filePath = await this.gptService.texToAudioGetter( fileId );

    res.setHeader('Content-Type','audio/mp3');
    res.status( HttpStatus.OK );
    res.sendFile( filePath );
    
  }
}
