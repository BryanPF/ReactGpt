import * as path from 'path';
import * as fs from 'fs';
import { InternalServerErrorException } from "@nestjs/common";



export const downloadImageAsPng = async( url: string ) =>{

    const resp = await fetch(url);
    
    if( !resp.ok ){
        throw new InternalServerErrorException('Download image was not possible');
    }

    const folderPath = path.resolve('./','./generated/images/');
    fs.mkdirSync( folderPath, { recursive: true } );

    const imageNeme = `${ new Date().getTime() }.png`;
    const buffer = Buffer.from( await resp.arrayBuffer() );

    fs.writeFileSync(`${ folderPath }/${ imageNeme }`, buffer);
    

}