-- Comprehensive Seed Script
-- 1. Inserts a "Main Collection" Drop
-- 2. Inserts 10 Beats with correct MP3/WAV mapping and pricing
-- 3. Links all Beats to the Drop
-- Run this in Supabase SQL Editor.

DO $$
DECLARE
  v_drop_id uuid;
  v_beat_id uuid;
BEGIN
  -- 0. Clear existing data to prevent duplicates
  TRUNCATE TABLE drop_beats, beats, drops CASCADE;

  -- 1. Create the Drop
  INSERT INTO drops (title, slug, description, cover_image_url, is_active, order_index, release_date)
  VALUES (
    'Main Collection', 
    'main-collection', 
    'Kolekcja najnowszych beatów @prodbyosin.', 
    NULL, 
    true, 
    0, 
    now()
  )
  RETURNING id INTO v_drop_id;

  -- 2. Insert Beats and Link them
  -- Pricing: MP3 (Basic) = 15000, WAV (Premium) = 30000, Stems (Exclusive - mapped to WAV) = 50000

  -- Beat 1
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Keep Calling', 
    'keep-calling', 
    'Melancholijny trap beat z emocjonalną melodią.', 
    140, 'Bm', 'Trap', 'Melancholijny', 
    '/keep-calling.mp3', 
    '/keep-calling.wav', 
    NULL, 
    15000, 30000, 50000, true, true
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 0);

  -- Beat 2
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Free Time', 
    'free-time', 
    'Spokojny, przestrzenny beat idealny do refleksyjnych tekstów.', 
    135, 'Dm', 'Trap', 'Nostalgiczny', 
    '/free-time.mp3', 
    '/free-time.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 1);

  -- Beat 3
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Movement', 
    'movement', 
    'Energetyczny beat z dynamicznym flow.', 
    140, 'F#m', 'Trap', 'Energiczny', 
    '/movement.mp3', 
    '/movement.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 2);

  -- Beat 4
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'October', 
    'october', 
    'Jesienny, klimatyczny beat.', 
    136, 'F#m', 'Trap', 'Nostalgiczny', 
    '/october.mp3', 
    '/october.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 3);

  -- Beat 5
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Soft Face', 
    'soft-face', 
    'Delikatny, emocjonalny beat.', 
    155, 'D#m', 'Trap', 'Romantyczny', 
    '/soft-face.mp3', 
    '/soft-face.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 4);

  -- Beat 6
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Lucky', 
    'lucky', 
    'Pozytywny, lekki beat z wpadającą w ucho melodią.', 
    134, 'G#m', 'Trap', 'Pozytywny', 
    '/lucky.mp3', 
    '/lucky.wav', 
    NULL, 
    15000, 30000, 50000, true, true
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 5);

  -- Beat 7
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Draw In', 
    'draw-in', 
    'Mroczny, wciągający beat.', 
    127, 'Am', 'Trap', 'Mroczny', 
    '/draw-in.mp3', 
    '/draw-in.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 6);

  -- Beat 8
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Another Life', 
    'another-life', 
    'Atmosferyczny beat z głębokimi basami.', 
    129, 'Cmaj', 'Trap', 'Futurystyczny', 
    '/another-live.mp3', 
    '/another-live.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 7);

  -- Beat 9
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Abstract', 
    'abstract', 
    'Eksperymentalny, abstrakcyjny beat.', 
    120, 'Am', 'Trap', 'Futurystyczny', 
    '/abstract.mp3', 
    '/abstract.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 8);

  -- Beat 10
  INSERT INTO beats (title, slug, description, bpm, key, genre, mood, audio_preview_url, audio_full_url, cover_image_url, price_mp3, price_wav, price_stems, is_published, is_featured)
  VALUES (
    'Come To', 
    'come-to', 
    'Pozytywny, melodyjny beat.', 
    137, 'Dmaj', 'Trap', 'Pozytywny', 
    '/come-to.mp3', 
    '/come-to.wav', 
    NULL, 
    15000, 30000, 50000, true, false
  )
  RETURNING id INTO v_beat_id;
  INSERT INTO drop_beats (drop_id, beat_id, order_index) VALUES (v_drop_id, v_beat_id, 9);
  
END $$;
