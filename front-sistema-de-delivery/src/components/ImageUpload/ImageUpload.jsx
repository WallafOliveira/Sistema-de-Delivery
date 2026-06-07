import React, { useRef, useState } from 'react';
import './ImageUpload.css';

const IMGBB_KEY = process.env.REACT_APP_IMGBB_KEY;

const ImageUpload = ({ value, onChange, label = 'Imagem', placeholder = '🖼️' }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState('');

  const handleClick = () => {
    setErro('');
    inputRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem válido.');
      return;
    }

    if (!IMGBB_KEY) {
      setErro('Chave REACT_APP_IMGBB_KEY não configurada no .env');
      return;
    }

    setUploading(true);
    setErro('');

    try {
      const base64 = await toBase64(file);
      const form = new FormData();
      form.append('image', base64.split(',')[1]);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: form,
      });

      const json = await res.json();
      if (!json.success) throw new Error('Upload falhou');

      onChange(json.data.url);
    } catch {
      setErro('Falha no upload. Verifique sua chave ImgBB.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemover = (e) => {
    e.stopPropagation();
    onChange('');
    setErro('');
  };

  return (
    <div className="image-upload-group">
      {label && <span className="image-upload-label">{label}</span>}

      <div
        className={`image-upload-card ${uploading ? 'uploading' : ''} ${value ? 'has-image' : ''}`}
        onClick={!uploading ? handleClick : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !uploading && handleClick()}
      >
        {uploading ? (
          <div className="upload-loading">
            <span className="upload-spinner" />
            <span>Enviando...</span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt="Preview" className="upload-preview-img" />
            <div className="upload-overlay">
              <span>Clique para trocar</span>
            </div>
            <button className="btn-remover-imagem" onClick={handleRemover} title="Remover imagem">
              ✕
            </button>
          </>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">{placeholder}</span>
            <span className="upload-text">Clique para selecionar</span>
            <span className="upload-subtext">PNG, JPG ou WEBP</span>
          </div>
        )}
      </div>

      {erro && <span className="upload-erro">{erro}</span>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default ImageUpload;
