import { useState, useEffect } from 'react'
import uuid from 'react-uuid'
import axios from 'axios'
import Input from './components/Input'
import CountriesData from './components/CountriesData'

function App() {
  const [input, setInput] = useState('')
  const [countriesData, setCountriesData] = useState([])
  const [names, setNames] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  function handleChange (e) {
    setInput(e.target.value)
  }

  useEffect(() => {
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      console.log(response)
      setCountriesData(response.data)
    })
    .catch(error => console.log(error))
  }, [input])
  
  useEffect(() => {
    if (input !== '') {
      const matchedNames = countriesData
        .filter(c => c.name.common.toLowerCase().includes(input))
        .map(c => c.name.common);
      setNames(matchedNames);
    } else {
      setNames([]);
    }
  }, [input, countriesData])
  console.log(names)
  

  return (
    <div className={`container ${darkMode && 'dark'}`}>
      <button onClick={() => setDarkMode(!darkMode)} className='theme-btn'>{darkMode ? 'light' : 'dark'}</button>
      <Input handleChange={handleChange} />
      {
        countriesData.length > 0 ? (
          names.length === 0 ? (
            <p></p>
          ) : names.length > 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : names.length === 1 ? (
            countriesData.map(c => {
              if (c.name.common.toLowerCase().includes(input)) {
                return <CountriesData key={uuid()} data={c} single={true} />
              } else {
                return null;
              }
            })
          ) : (
            countriesData.map(c => {
              if (c.name.common.toLowerCase().includes(input)) {
                return <CountriesData key={uuid()} data={c} single={false} />
              } else {
                return null
              }
            })
          )
        ) : null
      }
    </div>
  )
}

export default App