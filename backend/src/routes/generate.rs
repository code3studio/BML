use actix_web::{post, web::Json, Error, HttpResponse};

use crate::{
    model::signature_model::{GenerateRequest, GenerateResponse},
    utils::generate_contract::generate_contract,
};

#[post("/generate")]
pub async fn generate(req: Json<GenerateRequest>) -> Result<HttpResponse, Error> {
    println!("req={:?} ", req);
    match generate_contract(req) {
        Ok(e) => {
            println!("rrr={}", e);
            if e == "deploy is failed " {
                Err(actix_web::error::ErrorExpectationFailed(e))
            } else {
                Ok(HttpResponse::Ok().json(GenerateResponse { url: e }))
            }
            // Handle success, possibly using 'e'
        }
        Err(e) => {
            println!("error=={}", e);
            return Err(actix_web::error::ErrorInternalServerError(
                "Error processing request",
            ));
        }
    }
    // Ok(HttpResponse::Ok().json("success"))
}
