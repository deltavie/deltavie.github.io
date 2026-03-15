import type { Character } from "../characters/Character"

export class Action{
    ActionPerformer: Character | null;
    // Make new action and assign performer.
    constructor(performer: Character){
        this.ActionPerformer = performer;
    }
    // Action logic.
    Update(): void{
    };
}