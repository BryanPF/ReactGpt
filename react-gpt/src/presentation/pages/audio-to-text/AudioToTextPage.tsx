import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBoxFile, TypingLoaders } from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
}


export const AudioToTextPage = () => {

  const [isLoading, setIsLoading ] = useState(false);
  const [messages, setMessages ] = useState<Message[]>([]);


  const handlePost = async( text: string, audioFile: File ) => {

    setIsLoading( true );
    setMessages( (prev) => [...prev, { text: text, isGpt: false }] );

    //TODO: UseCase
    const resp = await audioToTextUseCase( audioFile, text )
    setIsLoading( false );

    if( !resp ) return;

    const gptMessage = `
## Transcripción:
__Duración:__ ${ Math.round( resp.duration ) } segundos
## El texto es:
${ resp.text }  
`;

    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

    for( const segment of resp.segments ){
      const segmentMessage = `
__De ${ Math.round( segment.start ) } a ${ Math.round( segment.end ) } segundos__
${ segment.text }
`;

      setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
    }

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-2">
          <GptMessage text="Hola, ¿Que audio quieres transcribir?"/>
          {
            messages.map( (message, index) => (
              message.isGpt
                ? ( <GptMessage key={ index } text={ message.text }/> )
                : ( <MyMessage key={ index } text={ (message.text === '') ? 'Transcribe el audio': message.text }/> )
            ))
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoaders />
              </div>
            )
          }

        </div>
      </div>
      <TextMessageBoxFile 
        onSendMessage={ handlePost }
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
        accept="audio/*"
      />
    </div>
  )
}
