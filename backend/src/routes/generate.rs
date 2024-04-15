use actix_web::{get, web::{BytesMut, Payload}, Error, HttpResponse};
use futures_util::StreamExt;

#[get("/generate")]
pub async fn generate(mut body:Payload)-> Result<HttpResponse, Error>  {
    let mut bytes = BytesMut::new();
    while let Some(item) = body.next().await {
        let item = item?;
        println!("Chunk: {:?}", item);
        bytes.extend_from_slice(&item);
    }
    Ok(HttpResponse::Ok().finish())
}