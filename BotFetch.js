// Agar FormData yuborilsa, Content-Type qo‘ymaymiz
export async function fetchPage(formData, isFormData = false) {
  try {
    const response = await fetch(`https://backend-u-mts.onrender.com/api/notify/new-announcement`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? formData : JSON.stringify({ announcementData: formData })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server javobi:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Telegram test natijasi:', data);
    return data;
  } catch (error) {
    console.error('❌ Xatolik:', error);
    
    if (error.name === 'SyntaxError') {
      console.error('📄 JSON parse xatoligi - server HTML yoki text qaytargan');
    }
  }
}
