You're welcome! The solution that worked was:
Using the grid layout with proper CSS:

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
}


<Droppable
  droppableId="notes-grid"
  type="NOTE"
  direction="horizontal"
  ignoreContainerClipping={true}
>



<Droppable
  droppableId="notes-grid"
  type="NOTE"
  direction="horizontal"
  ignoreContainerClipping={true}
>


<Droppable
  droppableId="notes-grid"
  type="NOTE"
  direction="horizontal"
  ignoreContainerClipping={true}
>