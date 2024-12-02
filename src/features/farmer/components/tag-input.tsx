import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { Plus, X } from "lucide-react";

export const TagInput = ({ 
  initialTags = [], // Default to an empty array to prevent TypeError
  onTagsChange
}: {
  initialTags?: string[]; // Make initialTags optional with a default value
  onTagsChange: (newTags: string[]) => void;
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const normalizedInput = inputValue.toLowerCase(); // Normalize input to lowercase
    if (normalizedInput && !tags.some(tag => tag.toLowerCase() === normalizedInput)) { // Check for existing tag in a case-insensitive manner
      const newTags = [...tags, inputValue];
      setTags(newTags);
      onTagsChange(newTags); // Update parent component
      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onTagsChange(newTags); // Update parent component
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center border border-primary p-2 rounded space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => ( // Removed optional chaining since tags is always an array
          <div
            key={index}
            className="flex items-center px-2 py-1 rounded text-primary"
          >
            {tag}
            <X
              className="ml-1 cursor-pointer"
              size={14}
              onClick={() => handleRemoveTag(index)}
            />
          </div>
        ))}
      </div>
      <div className="relative flex items-center space-x-2 mt-2">
        <input
          id="tags"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
          placeholder="Add"
          className="border-primary"
        />
        <button onClick={handleAddTag} className="p-1 rounded bg-primary text-white">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
