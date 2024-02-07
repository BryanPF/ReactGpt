import { useRef, useState } from "react"
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoaders } from "../../components";
import { translateStreamUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
}


const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];


export const TranslateStreamPage = () => {

  const abortController = useRef( new AbortController() );
  const isRunning = useRef(false);

  const [isLoading, setIsLoading ] = useState(false);
  const [messages, setMessages ] = useState<Message[]>([]);


  const handlePost = async( text: string, selectedOption: string ) => {

    if( isRunning.current ){
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading( true );
    isRunning.current = true;
    const newMessage = `Traduce: "${ text }" al idioma ${ selectedOption }`;
    setMessages( (prev) => [...prev, { text: newMessage, isGpt: false }] );

    const stream = translateStreamUseCase( text, selectedOption, abortController.current.signal );
    setIsLoading( false );

    setMessages( (messages) => [...messages, { text: '', isGpt: true }] );

    for await( const text of stream ){
      setMessages( (messages) => {
        const newMessages = [...messages];
        newMessages[ newMessages.length - 1 ].text = text;
        return newMessages;
      });
    }

    isRunning.current = false;

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-2">
          <GptMessage text="Hola, ¿Que quieres que traduzca hoy?"/>
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
      <TextMessageBoxSelect
        onSendMessage={ handlePost }
        placeholder="Escribe aquí lo que deseas"
        options={ languages }
      />
    </div>
  )
}


