import React from 'react'
import Accordion from './Accordion'

export default function Faq() {
  return (
    <>
        <h3 className='col-span-full text-center font-manrope text-3xl leading-11 uppercase font-semibold mb-16'>ÎNTREbări frecvent</h3>
        <Accordion title="Cum pot comanda un cadou și ce opțiuni de personalizare există?">
            <p>Acceptăm plăți cu card bancar, plăți electronice și transfer bancar. Toate tranzacțiile sunt procesate în siguranță, iar datele dvs. sunt protejate.</p>
        </Accordion>
        <Accordion title="Ce metode de plată acceptați și cum este asigurată securitatea?">
            <p>Acceptăm plăți cu card bancar, plăți electronice și transfer bancar. Toate tranzacțiile sunt procesate în siguranță, iar datele dvs. sunt protejate.</p>
        </Accordion>
        <Accordion title="Cum se face livrarea și cât durează?">
            <p>Acceptăm plăți cu card bancar, plăți electronice și transfer bancar. Toate tranzacțiile sunt procesate în siguranță, iar datele dvs. sunt protejate.</p>
        </Accordion>
        <Accordion title="Ce opțiuni există pentru comenzi corporate sau în cantități mari?">
            <p>Acceptăm plăți cu card bancar, plăți electronice și transfer bancar. Toate tranzacțiile sunt procesate în siguranță, iar datele dvs. sunt protejate.</p>
        </Accordion>
        <Accordion title="Pot returna produsele sau vedea cadourile înainte de achiziție?" last>
            <p>Acceptăm plăți cu card bancar, plăți electronice și transfer bancar. Toate tranzacțiile sunt procesate în siguranță, iar datele dvs. sunt protejate.</p>
        </Accordion>
        <p className='col-span-full text-center mt-8 mb-24'>Nu ai găsit răspunsul la întrebarea ta? Poți consulta oricând lista noastră cu informații esențiale aici:</p>
    </>
  )
}
