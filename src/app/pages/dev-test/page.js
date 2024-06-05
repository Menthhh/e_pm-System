'use client'

const Page = () => {

  function onSubmit() {
    alert('trye to send email..');
    fetchData();
  }

  async function fetchData() {
    try {
      let usrsparams = "?mailto=tonkla.pokaew@wdc.com";
      usrsparams += "&subject=epm_test";
      usrsparams += "&body=Hello World";
      usrsparams += "&mailsender=epm-system@wdc.com";
      usrsparams += "&cc=";
      usrsparams += "&namesender=epm-system@wdc.com";
      const response = await fetch('http://172.17.70.201/tme/api/email_send.php' + usrsparams);
      const data = await response.json();
      console.log(data);
      alert('Sent email Done');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <h3 className='pl-6'> Email Test Sender</h3>
      <hr></hr>
      <button style={{ paddingLeft: '10px', border: '1px solid red' }} onClick={onSubmit}>Click</button>
    </div>

  );
};

export default Page;