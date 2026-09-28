interface Env {
  CIRCUITS_KV?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json<{
      title: string;
      netlist: string;
      ctz: string;
    }>();

    if (!data.ctz && !data.netlist) {
      return new Response(JSON.stringify({ error: 'Missing netlist or ctz data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate lightweight unique edge ID
    const circuitId = Math.random().toString(36).substring(2, 9);

    // If Cloudflare KV is bound, persist schematic at edge
    if (context.env.CIRCUITS_KV) {
      await context.env.CIRCUITS_KV.put(
        `circuit:${circuitId}`,
        JSON.stringify({
          id: circuitId,
          title: data.title || 'Untitled Circuit',
          ctz: data.ctz,
          createdAt: new Date().toISOString()
        })
      );
    }

    const host = new URL(context.request.url).origin;
    const shareUrl = `${host}/#ctz=${data.ctz}`;

    return new Response(JSON.stringify({
      id: circuitId,
      url: shareUrl,
      title: data.title,
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
