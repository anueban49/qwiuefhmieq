"use client";
import { useState, useEffect } from "react";
import { ArticleType } from "./types";
//1. call the current article from the db -< which is deployed on the cllients side.
//2. edit, create, delete
//3

export function ArticlesControl() {
  const [article, setArticle] = useState<ArticleType[]>([]);
  //   useEffect(() => {
  //     //call the data and set it in the article
  //   }, []);

  const updateArticle = async () => {
    try {
      //funciton to update the article
    } catch (e) {
      console.log(e);
    }
  };

  const deleteArticle = async () => {
    try {
      //function to delete the article from database
    } catch (e) {
      console.log(e);
    }
  };
  const createArticle = async () => {
    try {
      //function to create article
    } catch (e) {
      console.error();
    }
  };
  return <></>;
}
