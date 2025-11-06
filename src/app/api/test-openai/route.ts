import { NextResponse } from 'next/server';
import { openai, MODELS } from '@/lib/openai/client';

/**
 * Route de test complète pour valider OpenAI
 * Test : GET /api/test-openai
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Vérifier que le client est initialisé
  if (!openai) {
    return NextResponse.json({
      success: false,
      error: 'OpenAI client not initialized',
      reason: 'OPENAI_API_KEY not found in environment',
      env_check: {
        hasKey: !!process.env.OPENAI_API_KEY,
        keyPreview: process.env.OPENAI_API_KEY ? 
          `${process.env.OPENAI_API_KEY.slice(0, 7)}...${process.env.OPENAI_API_KEY.slice(-4)}` : 
          'not set'
      }
    }, { status: 500 });
  }

  results.tests.client_initialized = { success: true };

  // Test 2: Vérifier les modèles configurés
  results.tests.models_config = {
    success: true,
    parsing_model: MODELS.PARSING,
    advanced_model: MODELS.ADVANCED,
  };

  // Test 3: Test simple de complétion (non-streaming)
  try {
    const simpleTest = await openai.chat.completions.create({
      model: MODELS.ADVANCED,
      messages: [
        { role: 'user', content: 'Réponds simplement "OK" si tu me reçois.' }
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    results.tests.simple_completion = {
      success: true,
      response: simpleTest.choices[0]?.message?.content,
      model_used: simpleTest.model,
      usage: simpleTest.usage,
    };
  } catch (error: any) {
    results.tests.simple_completion = {
      success: false,
      error: error.message,
      code: error.code,
      type: error.type,
    };
    
    // Si le test simple échoue, on retourne immédiatement
    return NextResponse.json({
      success: false,
      message: 'Simple completion test failed',
      ...results
    }, { status: 500 });
  }

  // Test 4: Test JSON structuré
  try {
    const jsonTest = await openai.chat.completions.create({
      model: MODELS.PARSING,
      messages: [
        { 
          role: 'system', 
          content: 'Tu réponds uniquement en JSON avec la structure: {"status": "ok", "message": "string"}' 
        },
        { role: 'user', content: 'Test de parsing' }
      ],
      max_tokens: 100,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const jsonResponse = JSON.parse(jsonTest.choices[0]?.message?.content || '{}');
    
    results.tests.json_parsing = {
      success: true,
      response: jsonResponse,
      model_used: jsonTest.model,
    };
  } catch (error: any) {
    results.tests.json_parsing = {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // Test 5: Test streaming
  try {
    const streamTest = await openai.chat.completions.create({
      model: MODELS.ADVANCED,
      messages: [
        { role: 'user', content: 'Compte de 1 à 5' }
      ],
      max_tokens: 50,
      temperature: 0.1,
      stream: true,
    });

    let streamedContent = '';
    let chunkCount = 0;

    for await (const chunk of streamTest) {
      const content = chunk.choices[0]?.delta?.content || '';
      streamedContent += content;
      chunkCount++;
    }

    results.tests.streaming = {
      success: true,
      chunks_received: chunkCount,
      full_response: streamedContent,
    };
  } catch (error: any) {
    results.tests.streaming = {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  // Test 6: Test de parsing naturel (comme dans l'app)
  try {
    const parseTest = await openai.chat.completions.create({
      model: MODELS.PARSING,
      messages: [
        { 
          role: 'system', 
          content: 'Parse cette commande en JSON: {"action": "create", "type": "event", "title": "string", "start_date": "ISO date"}' 
        },
        { role: 'user', content: 'rdv demain à 14h' }
      ],
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(parseTest.choices[0]?.message?.content || '{}');
    
    results.tests.natural_language_parsing = {
      success: true,
      input: 'rdv demain à 14h',
      parsed: parsed,
      has_required_fields: !!(parsed.action && parsed.type && parsed.title),
    };
  } catch (error: any) {
    results.tests.natural_language_parsing = {
      success: false,
      error: error.message,
    };
  }

  // Résumé final
  const allSuccess = Object.values(results.tests).every((test: any) => test.success);

  return NextResponse.json({
    success: allSuccess,
    message: allSuccess ? 
      '✅ Tous les tests OpenAI passent avec succès !' : 
      '⚠️ Certains tests ont échoué',
    summary: {
      total_tests: Object.keys(results.tests).length,
      passed: Object.values(results.tests).filter((t: any) => t.success).length,
      failed: Object.values(results.tests).filter((t: any) => !t.success).length,
    },
    ...results
  });
}
