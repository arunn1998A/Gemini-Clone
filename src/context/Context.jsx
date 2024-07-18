import { createContext, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState('');
  const [recentprompt, setRecentPrompt] = useState('');
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showresult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev + nextWord)
    }, 75 * index);
  }

  const onSent = async (prompt) => {
    setResultData('')
    setLoading(true)
    setShowResult(true)
    setRecentPrompt(input)

    const response = await run(input);
    let responseArray = response.split("**");
    let newResponse = '';

    for (let i = 0; i < responseArray.length; i++) {
      if (i == 0 || i % 2 !== 1) {
        newResponse += responseArray[i]
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>"
      }
    }

    let newResponse2 = newResponse.split("*").join("</br>");

    setResultData(newResponse2)
    setLoading(false)
    setInput("")
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentprompt,
    showresult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
