import { useRef, useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoaders } from "../../components";
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
}


export const ProsConsStreamPage = () => {

  const abortController = useRef( new AbortController() );
  const isRunning = useRef(false);

  const [isLoading, setIsLoading ] = useState(false);
  const [messages, setMessages ] = useState<Message[]>([]);


  const handlePost = async( text: string ) => {

    if( isRunning.current ){
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading( true );
    isRunning.current = true;
    setMessages( (prev) => [...prev, { text: text, isGpt: false }] );

    const stream = prosConsStreamGeneratorUseCase( text, abortController.current.signal );
    setIsLoading( false );

    setMessages( (messages) => [ ...messages, { text: '', isGpt: true } ] );

    for await ( const text of stream ){
      setMessages( (messages) => {
        const newMessages = [...messages];
        newMessages[ newMessages.length - 1 ].text = text;
        return newMessages;
      });

    }

    isRunning.current = false;

    // const reader = await prosConsStreamUseCase( text );
    // setIsLoading( false );


    // if( !reader ) return alert('No se pudo generar el reader');
    
    // //Generar el último mensaje
    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages( (messages) => [ ...messages, { text: message, isGpt: true } ] );

    // while( true ){
    //   const { value, done } = await reader.read();
    //   if( done ) break;

    //   const decondedChunk = decoder.decode( value, { stream: true } );
    //   message += decondedChunk;

      // setMessages( (messages) => {
      //   const newMessages = [...messages];
      //   newMessages[ newMessages.length - 1 ].text = message;
      //   return newMessages;
      // });
    // }


  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-2">
          <GptMessage text="Hola, ¿Que deseas comparar hoy?"/>
          {
            messages.map( (message, index) => (
              message.isGpt
                ? ( <GptMessage key={ index } text={ message.text }/> )
                : ( <MyMessage key={ index } text={ message.text }/> )
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
      <TextMessageBox 
        onSendMessage={ handlePost }
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  )
}
