/**
 * Generates and downloads a custom AwareSphere certificate on a Canvas.
 */
export const downloadCertificate = (userName, milestoneName, categoryName) => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 800, 600);
  gradient.addColorStop(0, '#0F172A'); // dark slate
  gradient.addColorStop(1, '#064E3B'); // deep green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#34D399'; // emerald
  ctx.lineWidth = 15;
  ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
  
  ctx.strokeStyle = '#0284C7'; // blue
  ctx.lineWidth = 3;
  ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

  // Header Logo
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AWARESPHERE', 400, 80);

  // Header Sub
  ctx.fillStyle = '#34D399';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('CERTIFICATE OF RECOGNITION', 400, 110);

  // Body text
  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'italic 20px Inter, sans-serif';
  ctx.fillText('This is proudly presented to', 400, 200);

  // Name
  ctx.fillStyle = '#38BDF8'; // cyan
  ctx.font = 'bold 42px Outfit, sans-serif';
  ctx.fillText(userName.toUpperCase(), 400, 260);

  // Purpose
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '18px Inter, sans-serif';
  ctx.fillText(`For completing the milestone:`, 400, 320);

  ctx.fillStyle = '#FBBF24'; // amber
  ctx.font = 'bold 24px Outfit, sans-serif';
  ctx.fillText(`"${milestoneName}"`, 400, 360);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText(`Category: ${categoryName} Awareness`, 400, 400);

  // Stamp / Watermark
  ctx.fillStyle = 'rgba(52, 211, 153, 0.1)';
  ctx.beginPath();
  ctx.arc(400, 480, 50, 0, 2 * Math.PI);
  ctx.fill();

  // Signature lines
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 500);
  ctx.lineTo(300, 500);
  ctx.moveTo(500, 500);
  ctx.lineTo(650, 500);
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText('Program Coordinator', 225, 520);
  ctx.fillText('Board of Trustees', 575, 520);

  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillText('Verified Secure PWA', 400, 500);

  // Download Action
  const link = document.createElement('a');
  link.download = `Certificate_${userName.replace(/\s+/g, '_')}_${milestoneName.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL();
  link.click();
};
