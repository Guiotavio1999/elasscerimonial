export function parseGuests(text){
 if(typeof text!=='string'||text.length>200000)throw Error('Cole uma lista com até 200 KB.');
 text=text.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
 const first=text.split('\n')[0]||'',separator=first.includes('\t')?'\t':first.includes(';')?';':',';
 const rows=[];let row=[],value='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
  else if(c===separator&&!quoted){row.push(value.trim());value='';}
  else if(c==='\n'&&!quoted){row.push(value.trim());if(row.some(Boolean))rows.push(row);row=[];value='';}
  else value+=c;
 }
 if(quoted)throw Error('Há aspas sem fechamento na lista.');
 row.push(value.trim());if(row.some(Boolean))rows.push(row);
 if(/^(nome|name|convidado)$/i.test(rows[0]?.[0]||''))rows.shift();
 if(!rows.length||rows.length>300)throw Error('Importe de 1 a 300 grupos por vez.');
 return rows.map((r,i)=>{const [title,phone='',email='',capacity='1',members='']=r;if(!title)throw Error('Linha '+(i+1)+': informe o nome.');const n=Number(capacity||1);if(!Number.isInteger(n)||n<1||n>5000)throw Error('Linha '+(i+1)+': quantidade de pessoas inválida.');if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Linha '+(i+1)+': e-mail inválido.');return {title,phone,email,capacity:n,members};});
}
