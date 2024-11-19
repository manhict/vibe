"use client";

import React, { useCallback, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUserContext } from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { emitMessage } from "@/lib/customEmits";
import { searchResults } from "@/lib/types";
import { toast } from "sonner";

export default function DraggableOptions() {
  const {
    showDragOptions,
    setQueue,
    user,
    setShowDragOptions,
    showAddDragOptions,
    setShowAddDragOptions,
  } = useUserContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingToAdd, setIsDraggingToAdd] = useState(false);

  const handleDragEnter = (e: React.DragEvent, type: "del" | "add") => {
    e.preventDefault();
    if (type == "del") {
      setIsDragging(true);
    } else {
      setIsDraggingToAdd(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, type: "del" | "add") => {
    e.preventDefault();
    if (type == "del") {
      setIsDragging(false);
    } else {
      setIsDraggingToAdd(false);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: "del" | "add") => {
    e.preventDefault();
    if (type == "del") {
      setIsDragging(true);
    } else {
      setIsDraggingToAdd(true);
    }
  };
  const handleDelete = useCallback(
    (song: searchResults) => {
      if (user?.role === "admin" || song.addedBy === user?._id) {
        emitMessage("deleteSong", {
          queueId: song?.queueId,
          addedBy: song?.addedBy,
        });
        setQueue((prev) => prev.filter((s) => s.id !== song.id));
      } else {
        toast.error(
          "only admin and user who add this song can delete this song"
        );
      }
    },
    [setQueue, user]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const jsonData = e.dataTransfer.getData("application/json");
      if (!jsonData) return;
      const song = JSON.parse(jsonData);
      if (!song) return;
      setIsDragging(false);
      setShowDragOptions(false);
      setShowAddDragOptions(false);
      handleDelete(song);
    },
    [handleDelete, setShowDragOptions, setShowAddDragOptions]
  );
  const handleDropToAdd = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const jsonData = e.dataTransfer.getData("application/json");
      if (!jsonData) return;
      const song = JSON.parse(jsonData);
      if (!song) return;
      setIsDragging(false);
      setShowDragOptions(false);
      setShowAddDragOptions(false);
      toast.info("Adding songs to other rooms coming soon...");
    },
    [setShowAddDragOptions, setShowDragOptions]
  );

  return (
    <div className="fixed z-50  w-full">
      <AnimatePresence>
        {showDragOptions && (
          <motion.div
            onDragEnter={(e) => handleDragEnter(e, "del")}
            onDragOver={(e) => handleDragOver(e, "del")}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card
              className={`fixed  left-1/2  -translate-x-1/2 bottom-5 w-60 h-36 transition-all duration-200 ease-in-out ${
                isDragging ? "scale-95" : "scale-100"
              }`}
              onDragLeave={(e) => handleDragLeave(e, "del")}
              onDrop={handleDrop}
            >
              <CardContent className="p-0 h-full">
                <div
                  className={`relative w-full h-full border border-dashed rounded-lg ${
                    isDragging ? "border-red-500" : "border-muted"
                  }`}
                >
                  <Trash2
                    className={`absolute ${
                      isDragging && "text-red-500 opacity-100"
                    } inset-0 m-auto text-muted-foreground opacity-25 w-14 h-14`}
                  />
                  <button
                    className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                    aria-label="Close drop area"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddDragOptions && (
          <motion.div
            onDragEnter={(e) => handleDragEnter(e, "add")}
            onDragOver={(e) => handleDragOver(e, "add")}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card
              className={`fixed  hidden left-5 bottom-5 w-60 h-36 transition-all duration-200 ease-in-out ${
                isDraggingToAdd ? "scale-95" : "scale-100"
              }`}
              onDragLeave={(e) => handleDragLeave(e, "add")}
              onDrop={handleDropToAdd}
            >
              <CardContent className="p-0 h-full">
                <div
                  className={`relative w-full h-full border border-dashed rounded-lg ${
                    isDraggingToAdd ? "border-purple" : "border-muted"
                  }`}
                >
                  <Star
                    className={`absolute ${
                      isDraggingToAdd && "text-purple border-purple opacity-100"
                    } inset-0 m-auto text-muted-foreground opacity-25 w-14 h-14`}
                  />
                  <button
                    className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                    aria-label="Close drop area"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
