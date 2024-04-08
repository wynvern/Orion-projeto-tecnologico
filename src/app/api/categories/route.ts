import { NextResponse } from "next/server";
import categories from "./data/categories.json";

export const GET = async () => {
	return NextResponse.json(categories, { status: 200 });
};
