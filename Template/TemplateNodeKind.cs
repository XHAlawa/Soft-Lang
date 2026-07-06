namespace Soft.Compiler.Template;

public enum TemplateNodeKind
{
    Root,
    Element,
    Text,
    Interpolation,
    
    // Bindings
    TextBinding,
    ValueBinding,
    ClassBinding,
    StyleBinding,
    AttributeBinding,
    
    // Directives
    IfDirective,
    ElseIfDirective,
    ElseDirective,
    ForEachDirective,
    SwitchDirective,
    CaseDirective,
    DefaultDirective,
    SlotDirective,
    
    // Visibility
    VisibleDirective,
    EnabledDirective,
    
    // Events
    EventBinding,
    
    // Components
    ComponentReference,
    
    // Property Extensions
    PropertyExtension,
    
    // Localization
    LocalizationDirective
}
