import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useForm } from 'react-hook-form';

const App = () => {
  const { register, handleSubmit } = useForm();
  const { register: registerRow, handleSubmit: handleSubmitRow } = useForm();
  const [rows, setRows] = useState([])
  const [clientInfo, setClientInfo] = useState({})
  const [sumLabor, setSumLabor] = useState(0)
  const [sumMterial, setSumMterial] = useState(0)
  
  const addRow = (data) => {
    const newRow = [data.description, data.labor, data.material, Number(data.labor) + Number(data.material)];
    setRows([...rows, newRow]);
  }

  const addClientInfo = (data) => { 
    setClientInfo(data);
  }

  useEffect(()=>{
    rows.map((row) => {
      setSumLabor(sumLabor + parseInt(row[1]));
    });

    rows.map((row) => {
      setSumMterial(sumMterial + parseInt(row[2]));
    });

  },[rows])



  const generatePDF = () => {
    
    let data = {}
    data.clientData = clientInfo
    data.RowsData = rows
    data.sumLabor = sumLabor
    data.sumMterial = sumMterial
    console.log(data,'uuuuuuuuuuuuuuuuuuuu');
    axios.post('http://localhost:5001/create-pdf', data)
      .then(() => axios.get('http://localhost:5001/fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        console.log(res,'hohohoi');
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, 'newPdf.pdf');
      })
  }

  
  // console.log(rows?.map((item, index) => item.map((it,ind)=> it[1])));



  return (
    <div className="container mt-[15%] mx-auto ">
      <h2 className='text-black font-bold text-center text-2xl uppercase mb-10 ' >Create an invoive, easy measy</h2>

      <form onSubmit={handleSubmit(addClientInfo)}>
        <input type="text" placeholder="Client name" name=" name" {...register('name',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <input type="text" placeholder="Client address" name="receiptId" {...register('address',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <input type="text" placeholder="Client email" name="price1" {...register('email',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <input type="text" placeholder="Client Phone number" name="price2" {...register('phone',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <input type="text" placeholder="Delivery address" name="price2" {...register('delivery_address',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <button type="submit" className='border-white bg-black rounded-md outline-none text-white m-2 p-2'>Add Client PDF</button>
      </form>

      <div className='my-[20px]'>
        <ul>
          <li><span className='font-bold mr-4' >Client name:</span>{clientInfo?.name}</li>
          <li><span className='font-bold mr-4' >Client address:</span> {clientInfo?.address}</li>
          <li><span className='font-bold mr-4' >Client email:</span> {clientInfo?.email}</li>
          <li><span className='font-bold mr-4' >Client phone number:</span>{clientInfo?.phone}</li>
          <li><span className='font-bold mr-4' >Delivery address:</span> {clientInfo?.delivery_address}</li>
        </ul>
      </div>

      <div > 
      <form onSubmit={handleSubmitRow(addRow)}>
        <input type="text" placeholder="Description" name="description" {...registerRow('description',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <input type="number" placeholder="Labor" name="labor" {...registerRow('labor',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1' />
        <input type="number" placeholder="Material" name="material" {...registerRow('material',{ required: {value : true, message:'This field is required'}  })} className='border border-black rounded-md outline-none text-black mr-1 pl-1'  />
        <button type="submit" className='border-white bg-black rounded-md outline-none text-white m-2 p-2'  >Add New Row</button>
      </form>

      </div>
      
      <table className='border-collapse w-full'>
        <thead>
          <tr className='border border-black'>
            <th className='border border-black w-[40%]'>Description</th>
            <th className='border border-black w-[20%]'>Labor</th>
            <th className='border border-black w-[20%]'>Material/Equipment</th>
            <th className='border border-black w-[20%]'>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((item, index) => (
            <tr key={index}>
              {item.map((it, i) => (
                <td key={i} className='border border-black text-center'>{i === 0 ? '': '$' } {it}</td>
              ))}
            </tr>
          ))}
          <tr className='border border-black'>
            <td className='border border-black w-[40%] font-bold text-center'>Balance due:</td>
            <td className='border border-black w-[20%] text-center'>$ {sumLabor}</td>
            <td className='border border-black w-[20%] text-center'>$ {sumMterial}</td>
            <td className='border border-black w-[20%] text-center'>$ {sumLabor + sumMterial }</td>
          </tr>
        </tbody>
      </table>

      <div className='mt-10 flex' >
      <button onClick={generatePDF} className='border-white bg-black rounded-md outline-none text-white mx-auto w-[30%]  p-2'  >Generate invoice</button>
          
      </div>

      
    </div>
  );
}

export default App;
