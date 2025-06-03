export async function POST(request: Request) {
    const body = await request.json();
    console.log("paynet-callback", body);

    return new Response("Success", { status: 200 });
}