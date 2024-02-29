use html::html;

const template0: &str = "<hello>world</hello>";

#[test]
fn it_works() {
		let template1 = html(template0, Vec::new());
		
		let other_template = "<hello>".to_string() + "world</hello>";
		let template2 = html(&other_template, Vec::new());
}
