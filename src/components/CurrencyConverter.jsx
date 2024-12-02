import { useState, useEffect } from "react";
import axios from 'axios';

import "./CurrencyConverter.css";

const CurrencyConverter = () => {
    const [rates, setRates] = useState(null);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [amount, setAmount] = useState(1);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [latestViewed, setLatestViewed] = useState([]);
    const [showConverted, setShowConverted] = useState(false);

    useEffect(() => {

        axios.get("https://v6.exchangerate-api.com/v6/6e6bda0efb4767c607af47ac/latest/USD"

        ).then((response) => {
            setRates(response.data.conversion_rates);
        }).catch((error) => {
            console.log("Ocorreu um erro", error);
        });

    }, []);

    useEffect(() => {      
        setShowConverted(false);
    }, [fromCurrency, toCurrency, amount, rates]);

    const getFromViewed = (index) => {
        const lastEntry = latestViewed[index];
        const [from, to] = lastEntry.split(" / ");

        setFromCurrency(from);
        setToCurrency(to);

        getConvertedRate(from, to, amount);
        
    }

    const getConvertedRate = (customFrom = fromCurrency, customTo = toCurrency, customAmount = amount) => {
        
        if (rates && customFrom !== customTo) {
            const rateFrom = rates[customFrom] || 0;
            const rateTo = rates[customTo] || 0;

            setConvertedAmount(((customAmount / rateFrom) * rateTo).toFixed(2));

            const viewed = `${customFrom} / ${customTo}`;
            if (!latestViewed.includes(viewed)) {
                setLatestViewed([...latestViewed, viewed]);
            }

            setTimeout(() => {
                setShowConverted(true);
            }, 0);
        }
    };

    if (!rates) {
        return <h1>Carregando...</h1>
    }

    return (
        <div className='converter'>
            <h2>Conversor de moedas</h2>
            <input type="number" placeholder='   Digite o valor...' value={amount} onChange={(e) => setAmount(e.target.value)} />
            <span>Selecione as moedas</span>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {Object.keys(rates).map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
            <span>para</span>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {Object.keys(rates).map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
            <button onClick={() => getConvertedRate()}>Convert</button>
            <div className="result">  
                {showConverted && (
                    <>
                        <h3>{convertedAmount} {toCurrency}</h3>                       
                    </>
                )}
            </div>  
            <h4>Últimos Vizualizados:</h4>
            <ul>
                {latestViewed.map((viewed, index) => {

                    return (
                        <li key={index}>
                            <a onClick={() => getFromViewed(index)}>{viewed}</a>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default CurrencyConverter