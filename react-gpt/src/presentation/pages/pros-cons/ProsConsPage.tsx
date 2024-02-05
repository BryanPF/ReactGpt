import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoaders } from "../../components";
import { prosConsDiscusserUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
}


export const ProsConsPage = () => {

  const [isLoading, setIsLoading ] = useState(false);
  const [messages, setMessages ] = useState<Message[]>([]);


  const handlePost = async( text: string ) => {

    setIsLoading( true );
    setMessages( (prev) => [...prev, { text: text, isGpt: false }] );

    const data = await prosConsDiscusserUseCase( text );
    
    if( !data.ok ){
      setMessages( (prev) => [...prev, { text: 'No se pudo realizar lo comparación', isGpt: true }] );
    }else{
      setMessages( (prev) => [...prev, { 
        text: data.content, 
        isGpt: true,
      }] );
    }

    setIsLoading( false );

    //TODO: Añadir el mensaje de  isGPT en true

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-2">
          <GptMessage text="Hola, puedes escribir lo que sea que quieres que compare y te de mis puntos de vista. Vamos preguntame..."/>
          {
            messages.map( (message, index) => (
              message.isGpt
                ? ( <GptMessage key={ index } text={ message.text}/> )
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
