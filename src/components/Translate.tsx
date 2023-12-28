"use client";

import { useEffect } from "react";
import { translate } from "../lib/translate-zod";

const Translate = () => {
  useEffect(() => {
    translate();
  }, []);

  return null;
};

export default Translate;
