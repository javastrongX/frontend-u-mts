// Faqat matn ma'lumotlarini yuborish uchun
export async function fetchPageSupport(textData) {
  try {
    const response = await fetch(`/api/new-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({supportText: textData})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server javobi:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('✅ Xabar yuborish natijasi:', data);
    return data;

  } catch (error) {
    console.error('❌ Xatolik:', error);
    if (error.name === 'SyntaxError') {
      console.error('📄 JSON parse xatoligi - server HTML yoki text qaytargan');
    }
    throw error;
  }
}