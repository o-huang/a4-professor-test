import Section from "../mongoose/sections/Section";
/**
 * @file Controller interface RESTful Web service API for section resource
 */
export default interface SectionDao {
    findSectionById(sid: string): Promise<Section>;
    findSectionByIdDeep(sid: string): Promise<Section>;
    findAllSections(): Promise<Section[]>;
    findAllSectionsDeep(): Promise<Section[]>;
    findAllSectionsForCourse(cid: string): Promise<Section[]>;
    findAllSectionsForCourseDeep(cid: string): Promise<Section[]>;
    createSectionForCourse(cid: string, section: Section): Promise<Section>;
    deleteSection(sid: string): Promise<any>;
    updateSection(sid: string, section: Section): Promise<any>;
}