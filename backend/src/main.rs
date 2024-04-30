mod model;
mod routes;
mod services;
mod utils;
use actix_cors::Cors;
use actix_web::web::scope;
use actix_web::{get, middleware::Logger, web::Data, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use env_logger::Env;
use routes::generate::generate;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    dotenv().ok();

    let server = HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_header()
                    .allow_any_method(),
            )
            .service(scope("/api").service(generate))
        // .app_data(db_data.clone())
    })
    .bind(("0.0.0.0", 5006))?;

    // Log a message indicating that the server is running
    println!("Server is running on port 5006");

    server.run().await
    // println!("Hello, world!");
}
