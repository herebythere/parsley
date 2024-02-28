// start with string, load file next

// go over with iterator

// output to file

// keep track of tabs
// remove whitespace cruft
// outputing 

// "<hello>{}</hello>", world

// 
use std::collections::HashMap;
use parsley::parse::StringIterator;
use parsley::type_flyweight::Results;

#[derive(Clone, Debug)]
pub enum Injection<'a> {
	String,
	VecString(Vec<String>),
	VecStringTuple(Vec<(String, String)>),
	Template(Template<'a>),
}

#[derive(Clone, Debug)]
pub struct Template<'a> {
	injections: Vec<Injection<'a>>,
	template: &'a str,
}

pub struct StackBit<'a> {
	template: &'a Template<'a>,
	iterator: StringIterator<'a>,
	inj_index: usize,
}

pub struct HtmlWriter<'a> {
	html_result: String,
	builds: HashMap<String, Results>,
	tab_count: usize,
	stack: Vec<StackBit<'a>>,
}

impl HtmlWriter<'_> {
	pub fn build<'a>(&'a mut self, template: &'_ Template) {
		// get template iterator
		let mut stack = Vec::<StackBit>::new();
		
		stack.push(StackBit {
			iterator: StringIterator::new(&template.template),
			template: template,
			inj_index: 0,
		});
		
		println!("{:?}", template);
		// add to html result by step
	
		// while loop. while 
		
		// if attribute injection, get text
		
		// if attribute map, add each attribute, if multiple on multiple lines
		
		// if injection, add current back to stack
		//  add new stack bit to stack.
	}
}

// standalone
pub fn html<'a>(template: &'a str, injections: Vec<Injection<'a>>) -> Template<'a> {
	Template {
		template: template,
		injections: injections,
	}
}

/*

fn document_component = (ctx, args) => {
	ctx.html("<i>", []);
}

*/


