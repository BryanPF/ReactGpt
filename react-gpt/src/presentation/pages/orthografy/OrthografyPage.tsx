import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoaders } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}


export const OrthografyPage = () => {

  const [isLoading, setIsLoading ] = useState(false);
  const [messages, setMessages ] = useState<Message[]>([]);


  const handlePost = async( text: string ) => {

    setIsLoading( true );
    setMessages( (prev) => [...prev, { text: text, isGpt: false }] );

    const data = await orthographyUseCase( text );
    
    if( !data.ok ){
      setMessages( (prev) => [...prev, { text: 'No se pudo realizar lo corrección', isGpt: true }] );
    }else{
      setMessages( (prev) => [...prev, { 
        text: data.message, 
        isGpt: true,
        info: {
          userScore: data.userScore,
          errors: data.errors,
          message: data.message,
        } 
      }] );
    }


    setIsLoading( false );

    //TODO: Añadir el mensaje de  isGPT en true

  }
 

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-2">
          <GptMessage text="Hola puedes escribir tu texto en español, y te ayudo con las correcciones"/>
          {
            messages.map( (message, index) => (
              message.isGpt
                ? ( <GptOrthographyMessage key={ index } { ...message.info! }/>)
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
      {/* <TextMessageBoxFile 
        onSendMessage={ handlePost }
        placeholder="Escribe aquí lo que deseas"
      /> */}
      {/* <TextMessageBoxSelect
        onSendMessage={ console.log } 
        options={ [{ id: '2', text: 'Hola' }, { id: '2', text: 'Mundo' }] }
      />   */}
    </div>
  )
}
