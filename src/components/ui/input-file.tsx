import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FileInput = ({ name, label, onChange }) => {
  return (
    <Card className="mt-5 mb-2 max-w-[240px]">
      <CardHeader>
        <Label htmlFor={name} className="text-center font-semibold text-gray-600">{label}</Label>
      </CardHeader>
      <CardContent>
        <Input type="file" className="cursor-pointer" id={name} name={name} onChange={onChange}/>
      </CardContent>
    </Card>
  );
};

export default FileInput;