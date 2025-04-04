import React from 'react'

export default function Collaboration() {
  return (
    <>
        <h3 className='col-span-full text-center font-manrope text-3xl leading-11 uppercase font-semibold mb-6'>CONDIȚIILE DE COOPERARE</h3>
        <p className='col-start-6 col-span-5 text-center mb-12'>De la selecție la livrare, vă ghidăm pas cu pas pentru a crea cadouri corporate personalizate, potrivite brandului dumneavoastră.</p>
        <div className='col-span-full grid grid-cols-15 gap-x-6 mb-42'>
            <CollaborationCard index={1} title='ALEGEȚI | CADOURILE' description='Consultați catalogul și selectați cadourile care vi se potrivesc.'/>
            <CollaborationCard index={2} title='ADAPTĂM & | PERSONALIZĂM' description='Vă sugerăm cum pot fi adaptate la brandul dumneavoastră.'/>
            <CollaborationCard index={3} title='STABILIM | TERMENELE' description='Încheiem un contract în care stabilim termenele de livrare.'/>
            <CollaborationCard index={4} title='EXECUTĂM | 2-4 Săptămâni' description='Lucrăm la proiectul dumneavoastră și vă actualizăm la fiecare etapă.'/>
            <CollaborationCard index={5} title='AMBALĂM | & LIVRĂM' description='Ambalăm cu atenție, respectând regimul de temperatură, și livrăm.'/>
        </div>
    </>
  )
}

const CollaborationCard = ({index, title, description}: {index: number, title: string, description: string}) => {
    return(
        <div className='rounded-3xl aspect-square col-span-3 relative flex flex-col justify-end lg:gap-3 2xl:gap-4 lg:p-6 2xl:p-8' style={{backgroundColor: `var(--blue${index})`}}>
            <span className='absolute left-8 top-12 text-white font-manrope text-[5rem] 2xl:text-8xl leading-9 font-semibold'>{index}</span>
            <p className='text-white font-manrope lg:text-2xl 2xl:text-[2rem] font-semibold lg:leading-8 2xl:leading-9 uppercase'>{title.split("|")[0]} <br/> {title.split("|")[1]}</p>
            <p className='text-white'>{description}</p>
        </div>  
    )
}